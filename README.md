# voozanoo
extension javascript for voozanoo

Guide des fonctions additionnel pour le DPI 
 
## Prérequis :  
Pour avoir les fonctions additionnel sur une tab, il faut ajouté un champs texte en bas du formulaire avec : 
 ```html
 <script src="https://www.dropbox.com/s/sc5k6k4rx4bex83/preprod.custom.js?dl=1"></script> 
  ```
pour le pre- prod et 
 ```html
<script src="https://www.dropbox.com/s/jjlgmue97ilwf4n/custom.js?dl=1"></script> 
 ```
pour le prod. 

![Prérequis](/images/prerequis.png)

## Comme suite :  
Une fois celui-ci fait, vous pouvez profiter des nouvelles fonctionnalités décrites ci dessous.  
 
### Fonction additionnelle : 
#### Mise à jour systématiquement d’un champ date avec la date du jour : 
Allez dans la question date que vous voulez mettre à jours systématiquement lors de la sauvegarde.  
Placez le libelle entre  `<span class='dua'>` et  `</span>`. 
 
 ```html
<span class='dua'>XXXX</span> 
 ```
 
![Mise à jour systématiquement d’un champ date avec la date du jour](/images/update_data_auto.png)
 
#### Initialisation d’un champ date avec la date du jour : 
Allez dans la question date que vous voulez initialiser avec la date du jour   
Placez le libellé entre  `<span class='du'>` et  `</span>`. 
 
```html
<span class='du'>XXXX</span> 
``` 

![Initialisation d’un champ date avec la date du jour](/images/updata_data.png)
 
 
#### Suppression de champs quand ils sont vide : 
Ajoutez un bloc conteneur et placez les questions qui doive disparaître. Dans ce bloc le titre doit etre entre `<b class='hide_white'>` et `</b>` 
 
```html 
<b class='hide_white'>XXXX</b> 
```
 
 ![Suppression de champs quand ils sont vide](/images/hide_white_feild.png)
 
#### Caché la liste des élément d’un sous questionnaire : 
![Caché la liste des élément d’un sous questionnaire](/images/hide_block_1.png)
Allez dans le sous-questionnaire dont vous voulez cacher de la colonne de droite. 
Dans la page d’accueille du sous-question (Boite a outils) édité le libellé. 
Placez votre libellé entre `<span id='hb_1'>` et `</span>`
 
```html
<i id='hb_1'>XXXXX</i> 
```
 
Attention, pour chaque sous questionnaire, vous devez avoir un chiffre différent. Exemple : hb_1, hb_2, hb_3,…, hb_99 

![Caché la liste des élément d’un sous questionnaire](/images/hide_block_02.png)
 
#### Affichage d’un sous-questionnaire dans un popup sur une liste on forme : 
**Attention**, cette fonctionnalité est associer avec la fonction de camouflage de liste (point 4). Donc lorsque la fonction popup est activée la liste du sou-formulé qui lui est associé sera caché. 
Allez dans la page ou vous avez placé votre list on-form . 
Editez le bloc texte (Smaty) avec le short-code  et ajouté `<div id="onform_1">` devant le short-code et `</div>` derrière le code. 

```html
<div id="onform_2" data-info="true" data-info-visible="false" data-info-white-field="false"  data-subform-min="1">{voozanoo_listing_on_form id_listing=435 tpl_filename=listing_on_form.tpl redirect_on_current_form=1}</div> 
```

![modifier list on form](/images/show_popup_02.png)
 
Vous devez égalmenet cocher la case « afficher la variable sur le questionnaire en amont » de la variable id_data du sous-questionnaire. Il faut aussi placer dans le champ abréviation de la variable le texte « id_data » comme ci-dessous 

![configuration id_data](/images/show_popup_03.png)
 
##### Parametre Aditionnel : 
Parametre | Description
------------ | -------------
data-info | ( par défaut : false ) si sa valeur est à true la procédure récupèrera les variables du sous-questionnaire dont la case « afficher la variable sur le questionnaire en amont » est coché.
data-info-visible | ( par défaut : false ) si sa valeur est à true la procédure affichera les variables du sous-questionnaire dont la case « afficher la variable sur le questionnaire en amont » est coché.
data-info-white-field | ( par défaut : false ) par défaut toute les variables du sous-questionnaire dont la case « afficher la variable sur le questionnaire en amont » est coché qui seront sans réponse ne s’affichera pas.
data-subform-min | ( par défaut : 0 ) permet de déterminé le minimum d’enregistrement que doit contenir le sous-questionnaire pour validé la sauvegarde du formulaire.
data-info-color | ( par défaut : aucun couleur) permet de placer une bordure de couleur autour des enregistrement qui sont ouvert par automatiquement ( voir après). Si ce paramètre n’est pas m’entonné, les enregistrements n’auront pas de bordure de couleur appliqué. 
 
Vous pouvez aussi faire affiché les détaille automatique de l’un ou l’autre ligne en créé une variable que renvoi ma variable 0 oui 1. 0 pour ne pas affiché et 1 pour afficher les détaille. Celle-ci doit avoir la case « afficher la variable sur le questionnaire en amont » coché et son abréviation doit être « `**show**` » . Cette variable peut-être de n’importe quel type 
 
![mise en évidance de ligne](/images/show_popup_04.png)
 
**Attention**, le chiffre  qui se trouve a la fin de onform_ doit être le même que celui que vous avez défini dans la fonction  de camouflage  (point 3). Si la valeur est incorrecte la fonction ne s’appliquera pas. 
 
**Attention**, les noms de variable du sous-questionnaire ne peuvent pas être présent dans le questionnaire parent. C’est-à-dire qu’il ne peut pas avoir une variable qui a le même nom dans le questionnaire principal et sous-questionnaire simultanément. 
 
![apparence 1](/images/show_popup_05.png)
 
 **Info**, cette fonction ne peut pas être utilisé en cascade de sous-formulaire. C’est-à-dire une ouvrir un sous-formulaire dans un popup quand le formulaire qui l’appel est lui même un sous-formulaire ouvert dans un popup. 
 
![apparence 2](/images/show_popup_06.png)

#### Initialisation de variable : 
Ajouté un champs texte aprés la question question que vous souhaiez initialiser par une valeur et introduisez le teste ci-dessous

```html 
<span class="init-value" data-value="XXXXXX" data-destination="id_pp_paper_file_id" />
```

##### Parametre
Parametre | Description
------------ | -------------
data-value | contient la valeur qui sera copier dans la question à initiliser .
data-destination | contient l'identifieat de la question a initiliser.

![exemple d'initilisation de question](/images/init_value.png)

**Info**, vous pouvez utilisez des variables smarty pour compété par des valeurs dinamique comme ci-dessus
